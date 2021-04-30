<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="storage-list">
	<div class="storage-list">
		<legend><xsl:value-of select="//i18n//*[@name='Default Storage']/@value"/></legend>
		<div class="storage">
			<xsl:attribute name="data-id">defiant-cloud</xsl:attribute>
			<i class="icon-storage"></i>
			<span class="name"><xsl:value-of select="//i18n//*[@name='Defiant Cloud']/@value"/></span>
			<span class="size">
				<xsl:call-template name="sys:storage-size">
					<xsl:with-param name="bytes" select="//FileSystem/@quota" />
				</xsl:call-template>
			</span>
		</div>
		
		<legend class="external"><xsl:value-of select="@name"/></legend>
		<xsl:for-each select="./*">
			<xsl:call-template name="storage-list-item"/>
		</xsl:for-each>
	</div>
</xsl:template>


<xsl:template name="storage-list-item">
	<xsl:variable name="mountName" select="@name"/>
	<xsl:variable name="baseDir" select="//*[@name='Mount']/*[@name=$mountName]"/>
	<div class="storage">
		<xsl:attribute name="data-id"><xsl:value-of select="@icon"/></xsl:attribute>
		<xsl:attribute name="data-path"><xsl:value-of select="@path"/></xsl:attribute>
		<i>
			<xsl:attribute name="class">icon-<xsl:value-of select="@icon"/></xsl:attribute>
		</i>
		<span class="name">
			<xsl:value-of select="@name"/>
			<xsl:if test="not(@name)">
				<xsl:value-of select="//i18n//*[@name='New Storage']/@value"/>
			</xsl:if>
		</span>
		<span class="size">
			<xsl:call-template name="sys:storage-size">
				<xsl:with-param name="bytes" select="$baseDir/@quota" />
			</xsl:call-template>
			<xsl:if test="not($baseDir/@quota)">N/A</xsl:if>
		</span>
	</div>
</xsl:template>


<xsl:template name="storage-details">
	<xsl:variable name="baseDir"/>
	<xsl:variable name="exclude" select="$baseDir/*[@name != 'Mount']"/>

	<xsl:variable name="used" select="sum($exclude//i/@size)"/>
	<xsl:variable name="quota">
		<xsl:call-template name="sys:storage-size">
			<xsl:with-param name="bytes" select="$baseDir/@quota" />
		</xsl:call-template>
	</xsl:variable>
	<xsl:variable name="available">
		<xsl:call-template name="sys:file-size">
			<xsl:with-param name="bytes" select="$baseDir/@quota - $used" />
		</xsl:call-template>
	</xsl:variable>

	<div class="tab-active_">
		<xsl:if test="@icon != 'new-storage'">
			<xsl:attribute name="class">tab-active_ connected</xsl:attribute>
		</xsl:if>
		<div class="row-group_">
			<div class="row-cell_ row-status">
				<div><xsl:value-of select="//i18n//*[@name='Status']/@value"/>:</div>
				<div>
					<i class="indicator"></i>
					<b class="conn-true"><xsl:value-of select="//i18n//*[@name='Connected']/@value"/></b>
					<b class="conn-working">
						<svg class="loading paused" viewBox="25 25 50 50" >
							<circle class="loader-path" cx="50" cy="50" r="20" />
						</svg>
						<xsl:value-of select="//i18n//*[@name='Connecting']/@value"/>
					</b>
					<b class="conn-false"><xsl:value-of select="//i18n//*[@name='Not connected']/@value"/></b>
					<button disabled="disabled" data-click="connect-storage">
						<xsl:value-of select="//i18n//*[@name='Connect']/@value"/>
					</button>
				</div>
			</div>
		</div>
		<hr/>
		<div class="row-group_ storage-name">
			<div class="row-cell_">
				<div><xsl:value-of select="//i18n//*[@name='Name']/@value"/>:</div>
				<div>
					<input type="text" name="storage-name" disabled="disabled">
						<xsl:attribute name="value"><xsl:choose>
							<xsl:when test="name() = 'FileSystem'">
								<xsl:value-of select="//i18n//*[@name='Defiant Cloud']/@value"/>
							</xsl:when>
							<xsl:otherwise><xsl:value-of select="@name"/></xsl:otherwise>	
						</xsl:choose></xsl:attribute>
						<xsl:attribute name="placeholder">
							<xsl:value-of select="//i18n//*[@name='New Storage']/@value"/>
						</xsl:attribute>
					</input>
				</div>
			</div>
		</div>
		<div class="row-group_ storage-type">
			<div class="row-cell_">
				<div><xsl:value-of select="//i18n//*[@name='Storage']/@value"/>:</div>
				<div>
					<selectbox data-change="select-storage-type">
						<xsl:for-each select="//CloudStorages/*">
							<xsl:if test="not(//Settings/Registry/*[@id='fs-cloud-storage']/*[@id = current()/@id])">
								<option>
									<xsl:attribute name="value"><xsl:value-of select="@id"/></xsl:attribute>
									<xsl:value-of select="@name"/>
								</option>
							</xsl:if>
						</xsl:for-each>
					</selectbox>
				</div>
			</div>
		</div>
		<div class="row-group_ disc-usage">
			<div class="row-cell_">
				<div><xsl:value-of select="//i18n//*[@name='Usage']/@value"/>:</div>
				<div>
					<xsl:call-template name="sys:disc-bar">
						<xsl:with-param name="base" select="$baseDir" />
						<xsl:with-param name="exclude" select="$exclude" />
					</xsl:call-template>
					<span>
						<xsl:value-of select="$available" />
						<xsl:text> available of </xsl:text>
						<xsl:value-of select="$quota" />

						<span class="file-count"><xsl:value-of select="count($exclude//i)" /> files</span>
					</span>
				</div>
			</div>
		</div>
		<hr/>
		<p>
			<i class="icon-info"></i>
			You can connect a cloud storage, thereby extending available storage in Defiant. To connect more than one disk storage, you need to upgrade to premium account. Upgrading grants you additional 15 GB of cloud storage.
		</p>
	</div>
</xsl:template>


<xsl:template name="bg-tree">
	<xsl:for-each select="./*">
		<div>
			<xsl:attribute name="class">tree-item</xsl:attribute>
			<xsl:attribute name="data-type"><xsl:value-of select="@type"/></xsl:attribute>
			<xsl:if test="@type = 'user-defined'">
				<xsl:attribute name="data-type"><xsl:value-of select="@type"/></xsl:attribute>
			</xsl:if>
			<span class="icon">
				<xsl:attribute name="style">background-image: url(~/icons/<xsl:choose>
						<xsl:when test="@icon = 'color-wheel'">icon-color-preset</xsl:when>
						<xsl:otherwise>tiny-generic-folder</xsl:otherwise>
					</xsl:choose>.png)</xsl:attribute>
			</span>
			<span class="name"><xsl:value-of select="@name"/></span>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="bg-list">
	<xsl:if test="@type">
		<div class="bg-preview add-custom"></div>
	</xsl:if>
	<xsl:for-each select="./*">
		<div>
			<xsl:attribute name="class">bg-preview</xsl:attribute>
			<xsl:attribute name="style"><xsl:value-of select="." disable-output-escaping="yes"/></xsl:attribute>
			<xsl:if test="@type"><xsl:attribute name="data-type"><xsl:value-of select="@type"/></xsl:attribute></xsl:if>
			<xsl:if test="../@type = 'user-defined'"><span class="bg-config" data-click="show-pop-bubble"></span></xsl:if>
		</div>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>

