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
	<div class="storage">
		<xsl:attribute name="data-id"><xsl:value-of select="@icon"/></xsl:attribute>
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
				<xsl:with-param name="bytes" select="@quota" />
			</xsl:call-template>
			<xsl:if test="not(@quota)">N/A</xsl:if>
		</span>
	</div>
</xsl:template>

<xsl:template name="storage-details">
	<!-- <xsl:variable name="baseDir" select="//FileSystem"></xsl:variable> -->
	<xsl:variable name="baseDir" select="//FileSystem//*[@name='Google Drive' and @quota]"></xsl:variable>
	<xsl:variable name="used" select="sum($baseDir//i/@size)"></xsl:variable>
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
		<xsl:if test="@quota">
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
					<button disabled="disabled" data-click="connect-cloud-storage">
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
					<input type="text" name="storage-name">
						<xsl:if test="name() = 'FileSystem'">
							<xsl:attribute name="disabled">disabled</xsl:attribute>
						</xsl:if>
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
							<option>
								<xsl:attribute name="value"><xsl:value-of select="@icon"/></xsl:attribute>
								<xsl:if test="@storage/@icon = current()/@icon"><xsl:attribute name="selected">true</xsl:attribute></xsl:if>
								<xsl:value-of select="@name"/>
							</option>
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
					</xsl:call-template>
					<span>
						<xsl:value-of select="$available" />
						<xsl:text> available of </xsl:text>
						<xsl:value-of select="$quota" />
						
						<span class="file-count"><xsl:value-of select="count($baseDir//i)" /> files</span>
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
	<xsl:for-each select="./*">
		<div>
			<xsl:attribute name="class">bg-preview</xsl:attribute>
			<xsl:attribute name="style"><xsl:value-of select="." disable-output-escaping="yes"/></xsl:attribute>
		</div>
	</xsl:for-each>
</xsl:template>

</xsl:stylesheet>

